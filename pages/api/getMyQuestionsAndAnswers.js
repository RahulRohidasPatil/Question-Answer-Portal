import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default async function handler(req, res) {
    const questionsSnapshot = await getDocs(query(collection(db, 'questions'), where("askedBy", "==", req.query.useremail)));
    const questions = [];
    questionsSnapshot.forEach(doc => questions.push({ id: doc.id, ...doc.data() }));
    const answersSnapshot = await getDocs(query(collection(db, 'answers'), where("answeredBy", "==", req.query.useremail)));
    const answers = [];
    answersSnapshot.forEach(doc => answers.push({ id: doc.id, ...doc.data() }));
    res.status(200).json({ questions, answers });
}