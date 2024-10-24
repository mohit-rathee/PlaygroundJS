import './globals.css';
import HomeTemplate from './components/layout/HomeTemplate'
import Card from './components/common/card';
import Image from 'next/image';
import { Chip } from '@nextui-org/react';
import Link from 'next/link';

export default function Home() {
    return (
        <HomeTemplate title="Welcome to playgroundJS">
            <Page />
        </HomeTemplate>
    )
}

const Page: React.FC = () => {
    return (
        <div className='min-h-[calc(100vh-3.5rem)] w-full flex flex-col 
                lg:flex-row-reverse p-5 gap-5
                bg-gradient-to-r from-gray-200 to-gray-300 
                dark:from-gray-600 dark:to-gray-500'>
            <OwnerCard />
            <Projects />
        </div>
    )
}

const ContactPlate: React.FC = () => {
    return (
        <div className='border-2 rounded-lg m-1 p-1 mx-2 flex flex-wrap gap-3 justify-stretch shadow-2xl'>
            <Link href='https://www.instagram.com/mohit__2505/' target='_blank'>
                <Image width={32} height={32} alt='instagram' src={'./instagram.svg'} />
            </Link>
            <Link href='https://github.com/mohit-rathee' target='_blank'>
                <Image width={32} height={32} alt='github' src={'./github.svg'} />
            </Link>
            <Link href='https://www.linkedin.com/in/mohit-rathee/' target='_blank'>
                <Image width={32} height={32} alt='linkedin' src={'./linkedin.svg'} />
            </Link>
            <Link href='https://www.discord.com/users/896276229664174170' target='_blank'>
                <Image width={32} height={32} alt='discord' src={'./discord.svg'} />
            </Link>
            <Link href='mailto:mohit.rathee2505@gmail.com' target='_blank'>
                <Image width={32} height={32} alt='email' src={'./email.svg'} />
            </Link>
        </div>
    )
}

const RolePlate: React.FC = () => {
    const roles = ["Arch Linux", "Django", "NextJS",]
    return (
        <div className='border-2 bg-gray-100 rounded-lg m-1 p-1 mx-2 flex flex-wrap gap-2 justify-center'>
            {roles.map((role, index) => (
                <Chip key={index}
                    className='bg-red-200 text-sm text-gray-500 hover:scale-110'>
                    {role}
                </Chip>
            ))}
        </div>
    )
}

const OwnerCard: React.FC = () => {
    return (
        <div className='lg:w-1/3 p-5 flex flex-col items-center justify-start gap-4
                bg-gradient-to-r from-gray-400 to-gray-300 
                dark:from-gray-500 dark:to-gray-600 
                rounded-xl text-white shadow-2xl'>

            <div className='w-full h-100 p-2 flex justify-center'>
                <Image
                    width={150}
                    height={150}
                    alt='Owner'
                    className="border-[6px] border-transparent 
                    bg-gradient-to-r from-purple-500 to-blue-500 
                    shadow-2xl rounded-full "
                    src="https://avatars.githubusercontent.com/u/89066152"
                />
            </div>
            <div className='text-center text-gray-800 dark:text-gray-50 text-2xl font-sans font-semibold'>
                @mohit-rathee
            </div>
            <ContactPlate />
            <div className='flex flex-col justify-start h-full'>
                <div className='text-center h-auto text-xl p-0 font-light
                        text-gray-800 dark:text-gray-50'>
                    Feel free to contribute or contact me!!! <br /> I&apos;m eager to meet teammates like you.
                </div>
            </div>
        </div>
    )
}

const Projects: React.FC = () => {
    return (
        <div className="p-10 h-auto text-center text-xl w-full rounded-lg shadow-2xl
                bg-gradient-to-r from-gray-400 to-gray-300 
                dark:from-gray-500 dark:to-gray-600">

            <p className="mb-6 text-2xl font-semibold
                text-gray-800 dark:text-gray-50">
                This project is a playground to practice your learnings from React and Next.
            </p>

            <div className="flex flex-wrap gap-8 justify-center items-center ">
                {/* Route Buttons */}
                <Card url="/drawing_master" target='_self' text="Drawing Master" imgSrc="/drawing_master.png" />
                <Card url="/typing_master" target='_self' text="Typing Master" imgSrc="/typing_master.png" />
                <Card url="https://github.com/mohit-rathee/PlaygroundJS/issues/1" target='_blank' text="Suggest New Ideas" imgSrc="/plus.svg" />
            </div>
        </div>
    );
};
