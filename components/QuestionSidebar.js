import { Dialog } from '@headlessui/react';
import { addDoc, collection, doc, increment, updateDoc } from "firebase/firestore";
import { useRef, useState } from 'react';
import { useMyContext } from '../ContextProvider';
import { db } from '../firebaseConfig';

export default function QuestionSidebar({ question, setAnswers, setQuestion }) {
    const [addAnswer, setAddAnswer] = useState(false);
    const answerRef = useRef();
    const [{ user, authenticated }, dispatch] = useMyContext();

    async function onAnswer() {
        const answer = answerRef.current.value;
        if (answer) {
            const newAnswer = {
                questionid: question.id,
                questionText: question.text,
                answeredBy: user.email,
                text: answer,
                likes: [],
                time: Date()
            };
            const docRef = await addDoc(collection(db, "answers"), newAnswer);
            setAnswers(answers => [...answers, { id: docRef.id, ...newAnswer }]);
            const questionRef = doc(db, "questions", question.id);
            await updateDoc(questionRef, { answers: increment(1) });
            question.answers++;
            setQuestion(question);
            setAddAnswer(false);
            alert("Answer Added Successfully");
        } else alert("Please write valid answer");
    }

    return <>
        <div className="space-y-1">
            <div>
                <div className="font-black">Asked By</div>
                <div className="text-sm">{question.askedBy}</div>
            </div>
            <div>
                <div className="font-black">Time</div>
                <div className="text-sm">{question.time}</div>
            </div>
            <div>
                <div className="font-black">Answers</div>
                <div className="text-sm">{question.answers}</div>
            </div>
            <div>
                <div className="font-black">Views</div>
                <div className="text-sm">{question.views}</div>
            </div>
            {authenticated && (user ? <>
                <button className="bg-neutral-200 hover:bg-neutral-300 p-1" type="button" onClick={_ => setAddAnswer(true)}>Add Your Answer</button>
            </> : <>
                <div>Log in to add your answer</div>
            </>)}
        </div>
        <Dialog open={addAnswer} onClose={() => { }} className="fixed inset-0 flex items-center justify-center bg-black/50 text-center">
            <Dialog.Panel className="p-1 w-2/3 rounded-full bg-white space-y-1">
                <Dialog.Title className="font-black">Add Your Answer</Dialog.Title>
                <input className='w-2/3 p-1 text-center border' name='answer' type="text" placeholder='Enter your Answer' ref={answerRef} />
                <div className="flex justify-end space-x-1 w-2/3 mx-auto">
                    <button type='button' onClick={_ => setAddAnswer(false)} className="p-1 bg-neutral-200 hover:bg-neutral-300">Cancel</button>
                    <button onClick={onAnswer} className="p-1 bg-neutral-200 hover:bg-neutral-300 ">Add Answer</button>
                </div>
            </Dialog.Panel>
        </Dialog>
    </>
}