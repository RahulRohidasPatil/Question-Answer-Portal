import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { db } from '../firebaseConfig';

export async function getServerSideProps() {
    const querySnapshot = await getDocs(query(collection(db, "questions"), orderBy("views", "desc")));
    const questions = [];
    querySnapshot.forEach(doc => questions.push({ id: doc.id, ...doc.data() }));
    return { props: { questions } };
}

export default function Home({ questions }) {
    return <>
        <Head>
            <title>Question Answer Portal</title>
        </Head>
        {questions.map(({ id, text, askedBy, time, answers, views }) => <div key={id} className="flex justify-center space-x-1 mt-1 group text-center">
            <div className="w-2/3 bg-neutral-200 group-hover:bg-neutral-300 p-1 flex flex-col justify-between">
                <Link href={`/${id}`}>
                    <button type="button" className="font-black">{text}</button>
                </Link>
                <div className="flex justify-between text-sm">
                    <div>asked by {askedBy}</div>
                    <div>Time: {time}</div>
                </div>
            </div>
            <div className="p-1 bg-neutral-200 group-hover:bg-neutral-300 flex flex-col justify-center">
                <div className="font-black">Answers</div>
                <div>{answers}</div>
            </div>
            <div className="p-1 bg-neutral-200 group-hover:bg-neutral-300 flex flex-col justify-center">
                <div className="font-black">Views</div>
                <div>{views}</div>
            </div>
        </div>)}
    </>
}
