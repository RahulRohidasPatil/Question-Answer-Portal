import { Dialog } from '@headlessui/react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useMyContext } from '../ContextProvider';
import { auth } from '../firebaseConfig';

export default function Header() {
    const [{ authenticated, user }, dispatch] = useMyContext();
    const [signIn, setSignIn] = useState(false);
    const signInRef = useRef();
    const [createUser, setCreateUser] = useState(false);
    const createUserRef = useRef();
    useEffect(_ => onAuthStateChanged(auth, user => {
        dispatch({ type: "setUser", user });
    }), [dispatch]);

    function onSignIn(e) {
        e.preventDefault();
        const { email, password } = signInRef.current;
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then(({ user }) => {
                dispatch({ type: 'setUser', user });
                setSignIn(false);
                alert("Sign In Successful");
            })
            .catch(({ message }) => alert(message));
    }

    function onCreateUser(e) {
        e.preventDefault();
        const { name, email, password } = createUserRef.current;
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then(({ user }) => {
                updateProfile(user, { displayName: name.value })
                    .then(_ => {
                        dispatch({ type: 'setUser', user });
                        setCreateUser(false);
                        alert("User Created Successfully");
                    })
            })
            .catch(({ message }) => alert(message));
    }

    return <>
        <div className='flex p-1 border-b border-black text-center sticky top-0 z-10'>
            <div className='flex-1'>
                <Link href="/">
                    <button className="text-2xl text-red-500 font-black ">Question Answer Portal</button>
                </Link>
            </div>
            {authenticated && (user ? <>
                <div className="flex items-center space-x-1">
                    <div className='text-sm'>Logged in as {user.displayName}</div>
                    <Link href="/console">
                        <button className='p-1 bg-neutral-200 hover:bg-neutral-300'>Go to Console</button>
                    </Link>
                </div>
            </> : <>
                <button className='p-1 bg-neutral-200 hover:bg-neutral-300' onClick={_ => setSignIn(true)}>Sign In</button>
            </>)}
        </div>
        <Dialog open={signIn} onClose={_ => { }} className="fixed inset-0 flex items-center justify-center bg-black/50 text-center">
            <Dialog.Panel className="w-2/3 p-1 rounded-full bg-white space-y-1" ref={signInRef} as="form">
                <Dialog.Title className="font-black">Sign In</Dialog.Title>
                <button type='button' className='underline block mx-auto' onClick={_ => {
                    setSignIn(false);
                    setCreateUser(true);
                }}>Not registered yet? Click Here</button>
                <input className='w-2/3 border p-1 text-center' name='email' type="email" placeholder='Enter your Email' />
                <input className='w-2/3 border p-1 text-center' name='password' type="password" placeholder='Enter your password' />
                <div className="flex justify-end space-x-1 w-2/3 mx-auto">
                    <button type='button' onClick={_ => setSignIn(false)} className="p-1 bg-neutral-200 hover:bg-neutral-300">Cancel</button>
                    <button onClick={onSignIn} className="p-1 bg-neutral-200 hover:bg-neutral-300 ">Sign In</button>
                </div>
            </Dialog.Panel>
        </Dialog>
        <Dialog open={createUser} onClose={_ => { }} className="fixed inset-0 flex items-center justify-center bg-black/50 text-center">
            <Dialog.Panel className="p-1 w-2/3 rounded-full bg-white space-y-1" ref={createUserRef} as="form">
                <Dialog.Title className="font-black text-xl">Create User</Dialog.Title>
                <button type='button' className='underline block mx-auto' onClick={_ => {
                    setCreateUser(false);
                    setSignIn(true);
                }}>Already Registered? Click Here</button>
                <input className='w-2/3 border p-1 text-center' name='name' type="text" placeholder='Enter your Display Name' />
                <input className='w-2/3 border p-1 text-center' name='email' type="email" placeholder='Enter your Email' />
                <input className='w-2/3 border p-1 text-center' name='password' type="password" placeholder='Enter your Password' />
                <div className="flex justify-end space-x-1 w-2/3 mx-auto">
                    <button type='button' onClick={_ => setCreateUser(false)} className="p-1 bg-neutral-200 hover:bg-neutral-300">Cancel</button>
                    <button onClick={onCreateUser} className="p-1 bg-neutral-200 hover:bg-neutral-300">Create User</button>
                </div>
            </Dialog.Panel>
        </Dialog>
    </>
}