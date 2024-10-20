import './globals.css';
import HomeTemplate from './components/layout/HomeTemplate'
import ImageFrame from './components/common/card';
import Card from './components/common/card';

export default function Home() {
    return (
        <HomeTemplate
            title="Playground"
            childComponent={<Explain />}
        />
    )
}

const Explain: React.FC = () => {
  return (
    <div className="p-10 h-full text-center text-xl w-full shadow-lg rounded-lg
            bg-gray-300 dark:bg-gray-700">
      <p className="mb-6 text-2xl font-semibold
            text-black dark:text-white
            ">
        This amazing project is a playground to practice your learnings from React and Next.
      </p>
      <div className="flex flex-wrap gap-8 justify-center">
        {/* Route Buttons */}
        <Card url="/drawing_master" text="Drawing Master" imgSrc="/drawing_master.png" />
      </div>
    </div>
  );
};
