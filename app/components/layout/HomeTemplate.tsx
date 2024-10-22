import React from "react";
import Navbar from "./Navbar";
import { ThemeProvider } from "next-themes";

interface HomeTemplateProps {
    title: string;
    children: React.ReactNode;
}

const HomeTemplate: React.FC<HomeTemplateProps> = ({ title, children }) => {
    return (
        <ThemeProvider defaultTheme="system" attribute="class">
            <div className="w-screen h-screen flex flex-col items-center justify-center
                            bg-gray-300 text-gray-800
                            dark:bg-gray-700 dark:text-gray-50 overflow-auto ">
                <Navbar title={title} />
                {children}
            </div>
        </ThemeProvider>
    );
};

export default HomeTemplate
