"use client"
import '../globals.css';
import HomeTemplate from '../components/layout/HomeTemplate';
import DrawingBoard from './components/drawingBoard';
export default function Home() {
    return (
        <HomeTemplate title="Drawing Master" >
            <DrawingBoard />
        </HomeTemplate>
    );
}

// TODO:
// 1. Use different types to create different shapes:
//      * emoji type could be 😀,😂...etc.
//      * image type could be an image.
// 2. Create an action table and perform undo/redo on that basis:
//      * actions could be 
//          # adding a stroke
//          # deleting a stroke
//          # changing its properties(color,border...etc)
//          # moving from location A to location B
//          # resizing and rotating

