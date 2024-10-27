import Image from 'next/image';


interface ButtonProps {
    url: string;
    text: string;
    target: '_top'|'_self'|'_blank'|'_target';
    imgSrc: string;
}

const Card: React.FC<ButtonProps> = ({ url,target, text, imgSrc }) => {
    return (
        <a
            href={url}
            target={target}
            className={`flex flex-col items-center justify-between w-44 h-56 
                        bg-gray-300 dark:bg-gray-400 p-4 rounded-xl shadow-xl hover:shadow-2xl 
                        transition-shadow duration-300 transform hover:scale-105`}
        >
            <div className="w-full h-full flex items-center justify-center">
                    <Image
                        src={imgSrc}
                        alt={text}
                        width={125}
                        height={125}
                        className="object-contain"
                    />
            </div>
            <p className="mt-4 dark:text-gray-50 text-gray-700 text-lg font-semibold">{text}</p>
        </a >
    );
};

export default Card
