import { createContext, useContext, useReducer } from "react";

const MyContext = createContext();

export default function ContextProvider({ children }) {

	const initialState = {
		authenticated: false,
		user: null,
	}

	function reducer(state, { type, user }) {
		switch (type) {
			default:
				return state;
			case "setUser":
				return { ...state, user, authenticated: true };
		}
	}

	return <MyContext.Provider value={useReducer(reducer, initialState)}>
		{children}
	</MyContext.Provider>
}

export function useMyContext() { return useContext(MyContext); }