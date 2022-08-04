import { addDoc, collection } from "firebase/firestore";
import { useRef } from "react";
import { useMyContext } from '../ContextProvider';
import { db } from '../firebaseConfig';

export default function AskQuestion({ setQuestions, setComponent }) {
    const questionRef = useRef();
    const [{ user }, dispatch] = useMyContext();

    async function onAsk() {
        const question = questionRef.current.value;
        if (question) {
            const newQuestion = {
                text: question,
                askedBy: user.email,
                views: 0,
                answers: 0,
                time: Date()
            };
            const docRef = await addDoc(collection(db, "questions"), newQuestion);
            setQuestions(questions => [...questions, { id: docRef.id, ...newQuestion }]);
            setComponent('myQuestions');
        } else alert("Please write valid question");
    }

    return <>
        <div className="text-lg font-black text-center">Ask a Question</div>
        <input className="p-1 w-2/3 mx-auto text-center block border" type="text" ref={questionRef} placeholder="Enter your question here..." />
        <button className="p-1 bg-neutral-200 hover:bg-neutral-300 block mx-auto" onClick={onAsk}>Ask Question</button>
    </>
}