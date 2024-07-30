import './globals.css';
import HomeTemplate from './components/HomeTemplate'
import Button from './components/button'


export default function Home() {
    return (
        <HomeTemplate
            title="Welcome to Playground"
            childComponent={<Explain />}
        />
    )
}

const Explain: React.FC = () => {
  return (
    <div className='p-5 text-center text-xl w-full bg-gray-200'>
      <p className='mb-4'>
        This amazing project is a playground to practice your learnings from React and Next.
      </p>
      <div className='flex flex-wrap gap-4 justify-center'>
        {/*Route Buttons*/}
        <Button url="/mouse_locator" text="Mouse Locator" />
      </div>
    </div>
  );
};
