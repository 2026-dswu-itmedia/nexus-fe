import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

// 행·카드 전체를 누르는 동안 살짝 줄어드는 피드백(whileTap)을 주기 위해 Link를 motion 컴포넌트로 감싼 것.
// 사용처마다 motion.create(Link)를 반복하지 않도록 한 곳에서 만든다.
const MotionLink = motion.create(Link);

export default MotionLink;
