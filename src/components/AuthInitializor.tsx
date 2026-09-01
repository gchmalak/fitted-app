"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      dispatch(setUser(null));
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user && typeof user === "object") {
        dispatch(setUser(user));
      } else {
        localStorage.removeItem("user");
        dispatch(setUser(null));
      }
    } catch (error) {
      console.error("Could not restore user:", error);
      localStorage.removeItem("user");
      dispatch(setUser(null));
    }
  }, [dispatch]);

  return null;
}
