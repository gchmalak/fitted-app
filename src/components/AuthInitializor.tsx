"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      dispatch(setUser(user));
    } catch {
      localStorage.removeItem("user");
    }
  }, [dispatch]);

  return null;
}
