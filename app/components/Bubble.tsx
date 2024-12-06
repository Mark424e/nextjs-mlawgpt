import Image from 'next/image';
import assistantPic from '../assets/assistant.webp';

const Bubble = ({ message }) => {
  const { content, role } = message;

  return (
    <div className={`flex items-end mx-2 my-4 ${role}`}>
      {role === 'assistant' && (
        <Image src={assistantPic} alt="assistant profile" width={30} className="rounded-full me-3" />
      )}
      <div className={`bubble px-4 py-2 text-sm text-left border-none shadow-md md:max-w-screen-sm ${role}`}>
        <div className="bubble-content">{content}</div>
      </div>
    </div>
  );
};

export default Bubble;