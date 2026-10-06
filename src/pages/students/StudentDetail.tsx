import WorkCard from '@/pages/students/components/WorkCard';
import BackHeader from '@/shared/components/BackHeader';
import NotFound from '@/shared/components/NotFound';
import Reveal from '@/shared/components/Reveal';
import SkeletonImage from '@/shared/components/SkeletonImage';
import TeamBadge from '@/shared/components/TeamBadge';
import { getStudentById, getTeamById, getWorksByIds } from '@/shared/utils/exhibition';
import { getStudentImage } from '@/shared/utils/image';
import { useParams } from 'react-router-dom';

const StudentDetail = () => {
  const { studentId = '' } = useParams<{ studentId: string }>();
  const student = getStudentById(studentId);

  if (!student) {
    // NotFound는 자체 px-5를 가지므로 DetailLayout main의 px-5와 겹치지 않게 상쇄한다.
    return (
      <div className="-mx-5 flex flex-1 flex-col">
        <NotFound />
      </div>
    );
  }

  const imageUrl = getStudentImage(student.image);
  const teamName = getTeamById(student.teamId)?.name ?? student.teamId;
  const works = getWorksByIds(student.workIds);

  // WORKS 상세와 같은 scroll reveal. 프로필 → 참여 작품 순으로 0.1초 간격.
  return (
    <>
      <BackHeader />
      <div className="flex flex-1 flex-col pt-6 pb-6">
        <Reveal>
          <section className="flex items-end gap-4">
            <SkeletonImage
              src={imageUrl}
              alt={`${student.name} 프로필 사진`}
              loading="eager"
              className="aspect-2/3 w-38 shrink-0"
            />
            {/* 시안에서 텍스트 묶음은 이미지 하단보다 조금 위에서 끝난다. */}
            <div className="min-w-0 flex-1 pb-3">
              <h1 className="text-semibold-24 text-navy-100">{student.name}</h1>
              <div className="mt-4">
                <TeamBadge name={teamName} />
              </div>
              <p className="text-regular-14 text-subtext-700 mt-4">{student.role}</p>
            </div>
          </section>
        </Reveal>
        <ul className="mt-6 flex flex-col gap-4" aria-label="참여 작품">
          {works.map((work, index) => (
            <li key={work.id}>
              <Reveal delay={0.1 * (index + 1)}>
                <WorkCard work={work} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default StudentDetail;
