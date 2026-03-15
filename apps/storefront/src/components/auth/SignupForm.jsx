"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@jewellery-retail/ui";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import userAction from "@/src/lib/action/user.action";
import { Toast } from "@/src/context/ToastContext";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  mobile_number: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .max(15, { message: "Mobile number must be less than 15 digits" })
    .regex(/^[0-9]+$/, { message: "Mobile number can only contain digits" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(15, { message: "Password must be no more than 15 characters long" }),
});

const SignupForm = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  const { success, error, warn } = Toast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      mobile_number: "",
      password: "user1234",
    },
  });

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSubscribe = (values) => {
    userAction
      .postSubscriber(values)
      .then()
      .catch((e) => {
        console.log(e);
      });
  };

  function onSubmit(values) {
    setLoader(true);
    if (isChecked) {
      handleSubscribe(values);
      userAction
        .registerUser(values)
        .then((resp) => {
          sessionStorage.setItem("user", JSON.stringify(resp.data.user));
          sessionStorage.setItem("jwt", JSON.stringify(resp.data.jwt));
          success("You are Successfuly Signup");
          setLoader(false);
          setCookie("jwt", resp.data.jwt, { maxAge: 60 * 60 * 24 });
          router.push("/");
        })
        .catch((e) => {
          console.log(e);
          warn("Server Error!");
          error(e?.response?.data?.error?.message);
          setLoader(false);
        });
    } else {
      warn("Agree to Terms and Conditions!");
    }
  }

  return (
    <div>
      <div className="flex min-h-[90vh] bg-white">
        {/* Left Image Section */}
        <div className="w-[55%] min-h-full">
          <Image
            src="/statics/contact_us.jpg"
            alt="Jewellery Model"
            className="object-cover w-full min-h-full"
            width={1500}
            height={1500}
          />
        </div>

        {/* Right Form Section */}
        <div className="w-[60%] flex flex-col justify-center px-16 pl-[80px]">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Sign up</h2>
          <p className="text-gray-600 mb-12">
            Sign up for free to experience new world of Jewellery.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-[75%]"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First and Last Name*</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="Jhon Doe"
                        {...field}
                        className="w-full px-4 !py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>
                      Put your First and Last name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="jhondoe@gmail.com"
                        {...field}
                        className="w-full px-4 !py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>Put your email address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number (WhatsApp) *</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="+91 7385302967"
                        {...field}
                        className="w-full px-4 !py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormDescription>
                      Put your WhatsApp mobile no.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mr-2 rounded text-primary focus:ring-primary"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="terms" className="text-gray-600">
                    Agree to our
                    <a href="#" className="text-primary">
                      {" "}
                      Terms of use{" "}
                    </a>
                    and
                    <a href="#" className="text-primary">
                      {" "}
                      Privacy Policy{" "}
                    </a>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    className="mr-2 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="newsletter" className="text-gray-600">
                    Subscribe to our new design catalogue
                  </label>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loader ? true : false}
                className={`w-[30%] bg-primary text-white py-6 rounded-lg hover:bg-primary-dark transition`}
              >
                Sign up
              </Button>

              <p className="text-start text-gray-600">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary">
                  Log in
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
