import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  url: string;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ url, text }) => {
  return (
    <Link href={url} target="_self" rel="noopener noreferrer">
      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
        {text}
      </button>
    </Link>
  );
};

export default Button;

