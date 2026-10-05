import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

// 백엔드 서버 없이 UI 작업을 하기 위한 dev 전용 mock. docs/api-spec.md의 응답 구조를 그대로 따른다.
// `.env`에 VITE_API_MOCK=true, VITE_API_BASE_URL=/api 를 설정하면 활성화된다. 빌드 결과물에는 포함되지 않는다.

interface MockReview {
  id: string;
  artworkId: string;
  content: string;
  createdAt: string;
}

const PAGE_SIZE = 8;
const RESPONSE_DELAY_MS = 300; // 로딩 상태를 눈으로 확인할 수 있을 정도의 지연
const SESSION_COOKIE = 'visitor_session';

const SEED_CONTENTS = [
  '작품의 아이디어와 전달하려는 메시지가 인상적이었어요.',
  '디자인이 깔끔하고 사용하기 편해 보여요!',
  '직접 체험해 보니 몰입감이 정말 좋았습니다. 설명도 친절하게 해주셔서 감사했어요. 앞으로의 발전도 기대할게요.',
  '색감이 예뻐요 🎨',
  '기획 의도가 잘 느껴지는 작품이었습니다. 특히 사용자 입장에서 어떤 문제를 해결하고 싶었는지가 분명하게 드러나서 좋았고, 실제로 서비스가 나오면 꼭 써보고 싶어요.',
  '수고 많으셨어요. 졸업 축하드립니다!',
  '아이디어가 신선해요. 이런 서비스가 실제로 있었으면 좋겠어요.',
  '인터랙션이 재밌었어요 ㅎㅎ',
  '설명 들으면서 많이 배웠습니다. 감사합니다.',
  '화면 전환이 부드럽고 완성도가 높아요.',
  '친구한테도 추천하고 싶은 작품이에요!',
];

const ARTWORK_IDS = [
  'noroon-노른',
  '마음',
  'signbridge',
  'hearing',
  'v-o',
  'sync-0',
  'blue-room',
  'poco',
  '저승명부록',
];

// 작품마다 11개(2페이지 분량)를 넣어 페이지네이션까지 확인할 수 있게 한다.
// 작성일은 서버 시작 시각보다 과거로 두어, 새로 쓴 감상평이 항상 맨 앞(최신순)에 온다.
const createSeed = (): MockReview[] => {
  const base = Date.now();
  return ARTWORK_IDS.flatMap((artworkId, artworkIndex) =>
    SEED_CONTENTS.map((content, index) => ({
      id: crypto.randomUUID(),
      artworkId,
      content,
      createdAt: new Date(base - (artworkIndex * 100 + index + 1) * 60_000).toISOString(),
    })),
  );
};

const reviews: MockReview[] = createSeed();

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  setTimeout(() => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
  }, RESPONSE_DELAY_MS);
};

const sendError = (
  res: ServerResponse,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) => sendJson(res, status, { error: { code, message, ...(details ? { details } : {}) } });

const readBody = (req: IncomingMessage) =>
  new Promise<string>((resolve) => {
    let raw = '';
    req.on('data', (chunk: Buffer) => {
      raw += chunk.toString();
    });
    req.on('end', () => resolve(raw));
  });

const hasSession = (req: IncomingMessage) =>
  (req.headers.cookie ?? '').includes(`${SESSION_COOKIE}=`);

const handleVisitorSession = (req: IncomingMessage, res: ServerResponse) => {
  const created = !hasSession(req);
  if (created) {
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=mock-visitor; Path=/; HttpOnly; SameSite=Lax`);
  }
  sendJson(res, created ? 201 : 200, { data: { created } });
};

const handleGetReviews = (
  res: ServerResponse,
  artworkId: string,
  searchParams: URLSearchParams,
) => {
  const page = Number(searchParams.get('page') ?? '1');
  if (!Number.isInteger(page) || page < 1) {
    return sendError(res, 400, 'VALIDATION_ERROR', '입력값을 확인해 주세요.', [
      { field: 'page', message: 'page는 1 이상의 정수여야 합니다.' },
    ]);
  }

  // 작성일 내림차순, 같으면 ID 내림차순
  const sorted = reviews
    .filter((review) => review.artworkId === artworkId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
  const totalCount = sorted.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const items = sorted
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    .map(({ id, content, createdAt }) => ({ id, content, createdAt }));

  sendJson(res, 200, {
    data: {
      items,
      pagination: { page, pageSize: PAGE_SIZE, totalCount, totalPages, hasNext: page < totalPages },
    },
  });
};

const handlePostReview = async (req: IncomingMessage, res: ServerResponse, artworkId: string) => {
  if (!hasSession(req)) {
    return sendError(res, 401, 'INVALID_VISITOR_SESSION', '방문자 세션이 유효하지 않습니다.');
  }

  let content: unknown;
  try {
    content = (JSON.parse(await readBody(req)) as { content?: unknown }).content;
  } catch {
    content = undefined;
  }

  const trimmed = typeof content === 'string' ? content.trim() : '';
  if (trimmed.length < 1 || trimmed.length > 1000) {
    return sendError(res, 400, 'VALIDATION_ERROR', '입력값을 확인해 주세요.', [
      { field: 'content', message: '감상평은 1자 이상 1,000자 이하로 입력해 주세요.' },
    ]);
  }

  const review: MockReview = {
    id: crypto.randomUUID(),
    artworkId,
    content: trimmed,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  sendJson(res, 201, { data: review });
};

const REVIEWS_PATH = /^\/api\/artworks\/([^/]+)\/reviews$/;

export const mockApiPlugin = (): Plugin => ({
  name: 'nexus-mock-api',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url ?? '/', 'http://localhost');
      const method = req.method ?? 'GET';

      if (url.pathname === '/api/visitor-sessions' && method === 'POST') {
        return handleVisitorSession(req, res);
      }

      const reviewsMatch = url.pathname.match(REVIEWS_PATH);
      if (reviewsMatch) {
        const artworkId = decodeURIComponent(reviewsMatch[1]);
        if (method === 'GET') return handleGetReviews(res, artworkId, url.searchParams);
        if (method === 'POST') return void handlePostReview(req, res, artworkId);
      }

      if (url.pathname.startsWith('/api/')) {
        return sendError(res, 404, 'NOT_FOUND', `mock에 없는 API입니다: ${method} ${url.pathname}`);
      }

      next();
    });
  },
});
