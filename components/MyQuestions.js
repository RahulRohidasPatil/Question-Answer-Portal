import { Dialog } from '@headlessui/react';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from '../firebaseConfig';
import Link from 'next/link';

export default function MyQuestions({ questions, setQuestions, setAnswers }) {
    const [edit, setEdit] = useState(false);
    const [question, setQuestion] = useState({});
    const [index, setIndex] = useState();
    const editRef = useRef();

    async function onDelete(questionID) {
        setQuestions(questions.filter(({ id }) => id != questionID));
        setAnswers(answers => answers.filter(({ questionid }) => questionid != questionID));
        await deleteDoc(doc(db, "questions", questionID));
        const answersSnapshot = await getDocs(query(collection(db, 'answers'), where("questionid", "==", questionID)));
        answersSnapshot.forEach(async ans => {
            await deleteDoc(doc(db, "answers", ans.id));
        });
        alert("Question Deleted successfully");
    }

    function startEdit(index) {
        setIndex(index);
        setQuestion(questions[index]);
        setEdit(true);
    }

    async function onEdit() {
        const newQuestion = editRef.current.value;
        const questionRef = doc(db, "questions", question.id);
        await updateDoc(questionRef, { text: newQuestion });
        setQuestions(questions => {
            questions[index].text = newQuestion;
            return questions;
        })
        setEdit(false);
        alert("Question Updated Successfully");
    }

    return <>
        <div className="text-lg font-black text-center">My Questions</div>
        {questions.length ? questions.map(({ id, text, views, time, answers }, index) => <div key={id} className="flex space-x-1 justify-center text-center">
            <div className="w-2/3 bg-neutral-200 flex flex-col justify-between">
                <div>
                    <Link href={`/${id}`}>
                        <button className='font-black'>{text}</button>
                    </Link>
                </div>
                <div className="flex justify-between text-sm px-1">
                    <div>Time: {time}</div>
                    <div>Views: {views}</div>
                    <div>Answers: {answers}</div>
                </div>
            </div>
            <div className="flex flex-col space-y-1">
                <button className="bg-neutral-200 hover:bg-neutral-300 p-1" onClick={_ => startEdit(index)}>Edit</button>
                <button className="bg-neutral-200 hover:bg-neutral-300 p-1" onClick={_ => onDelete(id)}>Delete</button>
            </div>
        </div>) : <div className="text-center">You have not asked any questions yet</div>}
        <Dialog open={edit} onClose={() => { }} className="fixed inset-0 flex items-center justify-center bg-black/50 text-center">
            <Dialog.Panel className="p-1 w-2/3 rounded-3xl bg-white space-y-1">
                <Dialog.Title className="font-black">Edit Question</Dialog.Title>
                <input className='p-1 w-2/3 text-center' type="text" defaultValue={question.text} ref={editRef} />
                <div className="flex justify-center space-x-1">
                    <button onClick={onEdit} className="p-1 bg-neutral-200 hover:bg-neutral-300">Save Changes</button>
                    <button type='button' onClick={_ => setEdit(false)} className="p-1 bg-neutral-200 hover:bg-neutral-300">Cancel</button>
                </div>
            </Dialog.Panel>
        </Dialog>
    </>
}