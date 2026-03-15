"use client";
import React, { useState } from "react";
import { Toast } from "@/src/context/ToastContext";
import { Icon } from "@iconify/react";

const emailRegex = /^[A-Za-z0-9. _%+-]+@[A-Za-z0-9. -]\. [A-Z]{2,4}$/i;

const validateEmail = (email) => {
  return emailRegex.test(email);
};

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const [loader, setLoader] = useState(false);

  const clearInput = () => {
    setEmail("");
    setMsg("");
    setName("");
  };

  const { success, error } = Toast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      const payload = {
        name,
        email,
        msg,
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        const previous = JSON.parse(
          localStorage.getItem("mmj_mock_contact_messages") || "[]"
        );
        localStorage.setItem(
          "mmj_mock_contact_messages",
          JSON.stringify([...previous, payload])
        );
      }
      success("Message sent successfully!");
      clearInput();
      setLoader(false);
    } catch (e) {
      console.log("Error:", e);
      error("Failed to send message.");
      setLoader(false);
    }
  };

  return (
    <form
      className="flex flex-col md:w-[60%] w-full p-8 px-6  gap-6 mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="font-semibold text-[40px]">Contact Us</h1>
      <input
        type="text"
        className="p-4 bg-slate-200 rounded-md focus:outline-[#00000052]"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="p-4 bg-slate-200 rounded-md focus:outline-[#00000052]"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        className="p-4 bg-slate-200 rounded-md focus:outline-[#00000052]"
        placeholder="Phone"
      />
      <textarea
        placeholder="Message"
        className="p-4 bg-slate-200 rounded-md resize-none focus:outline-[#00000052]"
        rows="6"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="btn btn-secondary !w-[40%] bg-sec hover:bg-sec flex items-center justify-center"
      >
        {loader ? (
          <Icon icon="svg-spinners:180-ring" width={20} />
        ) : (
          <span>Send</span>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
