import { BlurryScreen, Scrollable } from "./Screens";
import TypingArena from "./typingComponents/TypingArena";
import ArenaProvider from "../context/ArenaContext";
import Cursor from "./typingComponents/Cursor";
import { Result } from "./Result";
import { useContext } from "react";
import { PageContext } from "../context/PageContext";

export default function MainPallet() {
    const { gameInfo } = useContext(PageContext)
    if (gameInfo.type == 'result')
        return <Result />
    else
        return (
            <ArenaProvider>
                <BlurryScreen>
                    <Scrollable>
                        <TypingArena />
                        <Cursor />
                    </Scrollable>
                </BlurryScreen>
            </ArenaProvider>
        )
}
