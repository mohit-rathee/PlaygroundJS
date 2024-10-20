import React from "react";
import Navbar from "./Navbar";
import { ThemeProvider } from "next-themes";

interface HomeTemplateProps {
    title: string;
    childComponent: React.ReactNode;
}

const HomeTemplate: React.FC<HomeTemplateProps> = ({ title, childComponent }) => {
    return (
        <ThemeProvider defaultTheme="system" attribute="class">
        <div className="w-screen h-screen flex flex-col items-center justify-center
                        bg-gray-300 text-gray-700
                        dark:bg-gray-700 dark:text-gray-100
                        ">
            <Navbar title={title} />
                {childComponent}
        </div>
        </ThemeProvider>
    );
};

export default HomeTemplate
