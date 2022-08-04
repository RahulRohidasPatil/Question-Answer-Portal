import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { useRef, useState } from 'react';
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';

export default function MyAnswers({ answers, setAnswers, setQuestions, questions }) {
    const [edit, setEdit] = useState(false);
    const [answer, setAnswer] = useState({});
    const editRef = useRef();
    const [index, setIndex] = useState();

    function startEdit(index) {
        setIndex(index);
        setAnswer(answers[index]);
        setEdit(true);
    }

    async function onEdit() {
        const newAnswer = editRef.current.value;
        setAnswers(answers => {
            answers[index].text = newAnswer;
            return answers;
        })
        setEdit(false);
        const answerRef = doc(db, "answers", answer.id);
        await updateDoc(answerRef, { text: newAnswer });
        alert("Answer Updated Successfully");
    }

    async function onDelete(answerID, questionid) {
        setAnswers(answers.filter(({ id }) => id != answerID));
        const index = questions.findIndex(({ id }) => id == questionid);
        questions[index].answers--;
        setQuestions([...questions]);
        await deleteDoc(doc(db, "answers", answerID));
        await updateDoc(doc(db, "questions", questionid), {
            answers: increment(-1)
        });

        alert("Answer Deleted successfully");
    }

    return <>
        <div className="text-lg font-black text-center">My Answers</div>
        {answers.length ? answers.map(({ id, questionid, questionText, text, time, likes }, index) => <div key={id} className="flex space-x-1 justify-center text-center">
            <div className="w-2/3 bg-neutral-200 flex flex-col justify-between p-1">
                <Link href={`/${questionid}`}>
                    <button className='text-sm text-start'>{questionText}</button>
                </Link>
                <div className='font-black'>{text}</div>
                <div className="flex justify-between text-sm">
                    <div>Time: {time}</div>
                    <div>Likes: {likes.length}</div>
                </div>
            </div>
            <div className="flex flex-col space-y-1 justify-center">
                <button className="bg-neutral-200 hover:bg-neutral-300 p-1" onClick={_ => startEdit(index)}>Edit</button>
                <button className="bg-neutral-200 hover:bg-neutral-300 p-1" onClick={_ => onDelete(id, questionid)}>Delete</button>
            </div>
        </div>) : <div className="text-center">You have not answered any question yet</div>}
        <Dialog open={edit} onClose={() => { }} className="fixed inset-0 flex items-center justify-center bg-black/50 text-center">
            <Dialog.Panel className="p-1 w-2/3 rounded-3xl bg-white space-y-1">
                <Dialog.Title className="font-black">Edit Answer</Dialog.Title>
                <input className='p-1 w-2/3 text-center' type="text" defaultValue={answer.text} ref={editRef} />
                <div className="flex justify-center space-x-1">
                    <button onClick={onEdit} className="p-1 bg-neutral-200 hover:bg-neutral-300">Save Changes</button>
                    <button type='button' onClick={_ => setEdit(false)} className="p-1 bg-neutral-200 hover:bg-neutral-300">Cancel</button>
                </div>
            </Dialog.Panel>
        </Dialog>
    </>
}