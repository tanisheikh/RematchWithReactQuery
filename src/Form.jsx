import React, { useState, useEffect } from "react";
import { useQuery,useMutation, useQueryClient, cancel } from "react-query";
import { useFormik, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import "./form.css";
import { addData ,fetchData} from "./server";

import * as Yup from "yup";

const Form = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.formModel);
const queryClient =new  useQueryClient()
  const{data} =useQuery("userData",fetchData)
  console.log("data>>",data)
  const addDataMution = useMutation((newAddData) => {
    console.log("newAddData>>",newAddData)
    addData(newAddData);
  });
  console.log("state>>", state);
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Please Enter your Username")
        .max(35)
        .matches(
          /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
          "Invalid UserName"
        ),
      email: Yup.string()
        .required("Please Enter your Email")
        .max(55)
        .matches(
          /^[a-z0-9]+(?!.*(?:\+{2,}|\-{2,}|\.{2,}))(?:[\.+\-]{0,1}[a-z0-9])*@gmail\.com$/gim,
          "Invalid EmailId"
        ),
      phone: Yup.string()
        .required("Please Enter your Phone Number")
        .min(10)
        .matches(/^(\+91|\+91\-|0)?[789]\d{9}$/, "Invalid phoneNumber"),
      password: Yup.string().required("Please Enter your Password").min(8),
      // .matches(
      //   "[0-9A-Za-z.@]+:[0-z]+",
      //   "Invalid password (Minimum eight characters, at least one letter, one number and one special character"
      // ),
      confirmPassword: Yup.string()
        .required("Please Enter your Password")
        .min(8),
    }),

    onSubmit: (values, { resetForm }) => {
      if (values.password === values.confirmPassword) {
        dispatch.formModel.createRecordAsync(values);
        addDataMution.mutate(values);

      }
      debugger;
      // console.log("formIkInitialValue", formik.initialValues);
      resetForm({ values: formik.initialValues });
      // console.log("values>>>", values);
      // console.log("valueobj>>",{ values: formik.initialValues })
      console.log("resetForm>>", formik.resetForm);
      console.log("value>>>", values);
    },
  });
  console.log("formik>>>", formik);
  console.log("state>>", state.userList);
  // const handleSubmitFun = () => {
  //   formik.setValues({ values: formik.initialValues });
  // };
  const getCachedData = () => {
    console.log("functioncalled")
    return queryClient.getQueryData('userData');
  };
  return (
    <div className="container">
      <Card className="cardCom">
        <h1 className="title_Btn">SignUp</h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col divinput">
              <label className="inputLabel">Username:</label>
              <span className="p-float-label">
                <InputText
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  className="allInput"
                />
                <label htmlFor="username">Username</label>
              </span>
              <span className="errorMsg">
                {" "}
                {formik.touched.username && formik.errors.username ? (
                  <div>{formik.errors.username}</div>
                ) : null}
              </span>
            </div>
            <div className="col divinput">
              <label className="inputLabel">Email:</label>
              <span className="p-float-label">
                <InputText
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="allInput"
                />
                <label htmlFor="email">Email</label>
              </span>
              <span className="errorMsg">
                {formik.touched.email && formik.errors.email ? (
                  <div>{formik.errors.email}</div>
                ) : null}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col divinput">
              <label className="inputLabel">Phone Number:</label>
              <span className="p-float-label">
                <InputMask
                  id="phone"
                  name="phone"
                  unmask="true"
                  mask="(999) 999-9999"
                  placeholder="(999) 999-9999"
                  value={formik.values.phone}
                  onChange={(e) => {
                    formik.setFieldValue("phone", e.target.value);
                  }}
                  className="allInput"
                ></InputMask>
                <label htmlFor="phone">Phone Number</label>
              </span>
              <span className="errorMsg">
                {formik.touched.phone && formik.errors.phone ? (
                  <div>{formik.errors.phone}</div>
                ) : null}
              </span>
            </div>
            <div className="col divinput">
              <label className="inputLabel" htmlFor="password">
                Password:
              </label>
              <span className="p-float-label">
                <Password
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="allInput"
                  feedback={false}
                  toggleMask
                />
                <label htmlFor="password">Password</label>
              </span>
              <span className="errorMsg">
                {formik.touched.password && formik.errors.password ? (
                  <div>{formik.errors.password}</div>
                ) : null}
              </span>
            </div>
            <div className="col divinput">
              <label className="inputLabel" htmlFor="password">
                confirm Password:
              </label>
              <span className="p-float-label">
                <Password
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  className="allInput"
                  feedback={false}
                  toggleMask
                />
                <label htmlFor="confirmPassword">ConfirmPassword</label>
              </span>
              <span className="errorMsg">
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div>{formik.errors.confirmPassword}</div>
                ) : null}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            label="Submit"
            disabled={
              !formik.isValid ||
              formik.isSubmitting ||
              formik.values.password !== formik.values.confirmPassword
            }
            className="title_Btn mt-2"
          />
          <i className="fa fa-thin fa-arrow-right"></i>
          <Button onClick={getCachedData}>Get Cached Data</Button>

        </form>
      </Card>
    </div>
  );
};

export default Form;
