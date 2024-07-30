import React from "react";

interface HomeTemplateProps {
    title: string;
    childComponent: React.ReactNode;
}

const HomeTemplate: React.FC<HomeTemplateProps> = ({ title, childComponent }) => {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <h1 className="w-full text-center font-bold bg-gray-300 py-2 text-4xl text-gray-50">
                {title}
            </h1>
            <div className='w-full flex-grow bg-gray-200 '>
                {childComponent}
            </div>
        </div>
    );
};

export default HomeTemplate
