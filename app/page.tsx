import './globals.css';
import HomeTemplate from './components/layout/HomeTemplate'
import Card from './components/common/card';
import Image from 'next/image';
import { Chip } from '@nextui-org/react';



export default function Home() {
    return (
        <HomeTemplate
            title="Welcome in playgroundJS"
            childComponent={<Page />}
        />
    )
}

const Page: React.FC = () => {
    return (
        <div className='w-full h-full flex p-5'>
            <Projects />
            <OwnerCard />

        </div>
    )

}
const OwnerCard: React.FC = () => {
    const roles = ["Arch Linux", "Django","NextJS",]
    return (
        <div className='w-48 h-full flex flex-col justify-start bg-gray-400 dark:bg-gray-500 rounded text-white'>
            <div className='text-center text-2lg font-mono font-bold'>
                Owner
            </div>
            <div className='w-full h-100 p-2  flex justify-center'>
                <Image
                    width={150}
                    height={150}
                    alt='......Owner'
                    className="border-4 shadow-gray-50 rounded-full "
                    src="https://avatars.githubusercontent.com/u/89066152"
                />

            </div>
            <div className='text-center text-2lg font-sans font-semibold'>
                Mohit Rathee
            </div>
            <div className='border-2 bg-gray-100 rounded-lg m-1 p-1 mx-2 flex flex-wrap gap-2 flex-between justify-center'>
                {roles.map((role, index) => (
                    <Chip key={index}
                        className='bg-red-200 text-sm text-gray-500 hover:scale-110'
                    >
                        {role}
                    </Chip>
                ))}
            </div>
            <div className='text-center text-2md'>
                About myself ...
            </div>

        </div >
    )

}
const Projects: React.FC = () => {
    return (
        <div className="p-10 h-full text-center text-xl w-full shadow-lg rounded-lg
            bg-gray-300 dark:bg-gray-700">
            <p className="mb-6 text-2xl font-semibold
            text-black dark:text-white
            ">
                This project is a playground to practice your learnings from React and Next.
            </p>
            <div className="flex flex-wrap gap-8 justify-start">
                {/* Route Buttons */}
                <Card url="/drawing_master" text="Drawing Master" imgSrc="/drawing_master.png" />
            </div>
        </div>
    );
};
