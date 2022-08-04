import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import Head from 'next/head';
import { useRef, useState } from 'react';
import QuestionSidebar from "../components/QuestionSidebar";
import { useMyContext } from '../ContextProvider';
import { db } from '../firebaseConfig';

export async function getServerSideProps({ params }) {
    const questionRef = doc(db, "questions", params.questionid);
    const questionSnap = await getDoc(questionRef);
    const answers = [];
    if (questionSnap.exists()) {
        await updateDoc(questionRef, { views: increment(1) });
        const question = { id: questionSnap.id, ...questionSnap.data() };
        const querySnapshot = await getDocs(query(collection(db, "answers"), where("questionid", "==", params.questionid)));
        querySnapshot.forEach(doc => answers.push({ id: doc.id, ...doc.data() }));
        return { props: { question, answers } };
    }
    else return { props: { error: true } };
}

export default function Question(props) {
    const [{ user, authenticated }, dispatch] = useMyContext();
    const [question, setQuestion] = useState(props.question);
    const [answers, setAnswers] = useState(props.answers);

    if (props.error) return <>
        <Head>
            <title>Question Not Found</title>
        </Head>
        <div className="text-center">Question Not Found</div>
    </>

    async function onLike(id, index) {
        answers[index].likes.push(user.email);
        setAnswers([...answers]);
        const answerRef = doc(db, "answers", id);
        await updateDoc(answerRef, {
            likes: arrayUnion(user.email)
        });
    }

    async function onUnlike(id, index) {
        answers[index].likes = answers[index].likes.filter(like => like != user.email);
        setAnswers([...answers]);
        const answerRef = doc(db, "answers", id);
        await updateDoc(answerRef, {
            likes: arrayRemove(user.email)
        });
    }

    return <>
        <Head>
            <title>{question.text}</title>
        </Head>
        <div className="flex space-x-1 text-center p-1">
            <QuestionSidebar question={question} setAnswers={setAnswers} setQuestion={setQuestion} />
            <div className="flex-1">
                <div className="text-lg font-black p-1 bg-neutral-200 rounded-full">{question.text}</div>
                {answers.length ? <>
                    <div className="underline">Answers:</div>
                    {answers.map(({ id, text, answeredBy, time, likes }, index) => <div key={index} className="mt-2 flex justify-center space-x-1">
                        <div className="sm:w-2/3 bg-neutral-200">
                            <div className="flex justify-between text-sm bg-neutral-300 px-1">
                                <div>answered by {answeredBy}</div>
                                <div>Time: {time}</div>
                            </div>
                            <div className="text-justify p-1">{text}</div>
                        </div>
                        {authenticated && user && (likes.includes(user.email) ? <>
                            <div className="flex items-center cursor-pointer" onClick={_ => onUnlike(id, index)} title="Unlike">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                <div>{likes.length}</div>
                            </div>
                        </> : <>
                            <div className="flex items-center cursor-pointer" onClick={_ => onLike(id, index)} title="Like">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                <div>{likes.length}</div>
                            </div>
                        </>)}
                    </div>)}
                </> : <>
                    <div>No Answers Yet</div>
                </>}
            </div>
        </div>
    </>
}