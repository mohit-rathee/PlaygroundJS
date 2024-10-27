import '../globals.css';
import HomeTemplate from '../components/layout/HomeTemplate';
import TypingMaster from './components/TypingMaster';


export default function Home() {
    return (
        <HomeTemplate title="Typing Master" >
            <TypingMaster />
        </HomeTemplate>
    );
}
