import { signOut } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";
import Head from "next/head";
import { useEffect, useState } from "react";
import AskQuestion from "../components/AskQuestion";
import Dashboard from "../components/Dashboard";
import MyAnswers from "../components/MyAnswers";
import MyQuestions from "../components/MyQuestions";
import { useMyContext } from "../ContextProvider";
import { auth } from '../firebaseConfig';

export default function Console() {
    const [{ user, authenticated }, dispatch] = useMyContext();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [component, setComponent] = useState('dashboard');
    const components = {
        'dashboard': <Dashboard questions={questions.length} />,
        'askQuestion': <AskQuestion setQuestions={setQuestions} setComponent={setComponent} />,
        'myQuestions': <MyQuestions questions={questions} setQuestions={setQuestions} setAnswers={setAnswers} />,
        'myAnswers': <MyAnswers answers={answers} setAnswers={setAnswers} setQuestions={setQuestions} questions={questions} />
    }
    useEffect(_ => {
        if (user) {
            fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getMyQuestionsAndAnswers?useremail=${user.email}`)
                .then(response => response.json())
                .then(data => {
                    setQuestions(data.questions);
                    setAnswers(data.answers);
                });
        }
    }, [user]);

    return <>
        <Head>
            <title>{user ? user.displayName : 'Console'}</title>
        </Head>
        {authenticated && (!user ? <div className="text-center">
            Please Sign In First to access your profile
        </div> : <div className="flex p-1">
            <div className="flex-1 space-y-1">
                {components[component]}
            </div>
            <div className="flex flex-col space-y-1">
                <button className="p-1 bg-neutral-200 hover:bg-neutral-300" onClick={_ => setComponent('dashboard')}>Dashboard</button>
                <button className="p-1 bg-neutral-200 hover:bg-neutral-300" onClick={_ => setComponent('askQuestion')}>Ask a Question</button>
                <button className="p-1 bg-neutral-200 hover:bg-neutral-300" onClick={_ => setComponent('myQuestions')}>My Questions</button>
                <button className="p-1 bg-neutral-200 hover:bg-neutral-300" onClick={_ => setComponent('myAnswers')}>My Answers</button>
                <button className="p-1 bg-neutral-200 hover:bg-neutral-300" onClick={_ => signOut(auth)}>Sign Out</button>
            </div>
        </div>)}
    </>
}