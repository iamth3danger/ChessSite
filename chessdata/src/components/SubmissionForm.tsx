import React from "react";
import { useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AccountInfo } from "../classes/AccountInfo";
import { start } from "repl";
import { FormInfo } from "../classes/FormInfo"



function SubmissionForm(props : FormInfo){

    const[userError, setUserError] = useState(false);

    async function checkUserName() {
        const url = `https://api.chess.com/pub/player/${props.account}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            if (response.status === 404)
                setUserError(true);
                props.setSubmittable(false);
            throw new Error(`Response status: ${response.status}`);
          }
          props.setSubmittable(true)
          return true;
        } catch (error) {
            if (error instanceof Error)
                console.error(error.message);
        }
    }

    return (
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Chess.com Account
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3
           text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={props.account}
            onChange={(e) => props.setAccount(e.target.value)}
          />
          {userError && (
            <p role="alert" className="text-red-500">
              invalid account name
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Date
          </label>
          <DatePicker
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black  font-semibold mb-3 leading-tight focus:outline-none focus:shadow-outline"
            selected={props.startDate}
            onChange={(date) =>
              date !== null ? props.setStartDate(date) : null
            }
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Date
          </label>
          <DatePicker
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black  font-semibold mb-3 leading-tight focus:outline-none focus:shadow-outline"
            selected={props.endDate}
            onChange={(date) =>
              date !== null ? props.setStartDate(date) : null
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue=700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={(e) => {
              e.preventDefault();
              checkUserName();
            }}
          >
            Submit
          </button>
        </div>
      </form>
    );
}

export default SubmissionForm;