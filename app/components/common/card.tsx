import Image from 'next/image';


interface ButtonProps {
    url: string;
    text: string;
    imgSrc: string;
}

const Card: React.FC<ButtonProps> = ({ url, text, imgSrc }) => {
    return (
        <a
            href={url}
            className={`flex flex-col items-center justify-between w-48 h-60 
                        bg-gray-100 dark:bg-gray-500 p-4 rounded-xl shadow-xl hover:shadow-2xl 
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
