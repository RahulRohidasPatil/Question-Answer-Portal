export default function Dashboard({ questions }) {
    return <>
        <div className="text-lg font-black text-center">Dashboard</div>
        <div className="text-center">You asked {questions} Questions</div>
    </>
}