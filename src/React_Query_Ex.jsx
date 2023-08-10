import axios from "axios";
import React, { useState } from "react";
import "./query.css";
import { useQuery, useMutation, useQueryClient, cancel } from "react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { addData, fetchData } from "./server";
import loading from "./loadingGif/loading.gif";

//The useQuery hook returns a handful of objects such as isSuccess, isError, isLoading, isFetching, data, and error.
//    "start": "react-scripts start",
// Resources
//   http://localhost:4000/posts
//   http://localhost:4000/comments
//   http://localhost:4000/profile

//   Home
//   http://localhost:4000

//Type s + enter at any time to create a snapshot of the database
//Watching..
const React_Query_Ex = () => {
  const [visible, setVisible] = useState(false);
  const [rowDataObj, setRowDataObj] = useState(null);
  const queryClient = useQueryClient();
const dispatch=useDispatch();
  // const fetchData = async () => {
  //   const response = await axios.get("http://localhost:4000/data");
  //   // console.log("signal>>>",signal)
  //   console.log("functioncall after 1 min");
  //   return response.data;
  // };
  const { isLoading, isFetching, error, data, status } = useQuery(
    "userData",
    fetchData, {
      onSuccess: () => {
        const data=queryClient.getQueryData('userData')
        dispatch.formModel.createRecordAsync(data);
  
      },
    }
  );
  // const addJsonData = async (newData) => {
  //   const response = await axios.post("http://localhost:4000/data", newData);
  //   console.log("response.data>>", response.data);

  //   return response.data;
  // };
  const addJsonDataMution = useMutation((newDataObj) =>
  addData(newDataObj)
  );
  const updateJsonData = async (postId, updatedD) => {
    const response = await axios.put(
      `http://localhost:4000/data/${postId}`,
      updatedD
    );
    console.log("response.data>>", response.data);
    return response.data;
  };

  const updatedDataRecieveFun = (updatedData) => {
    updateJsonData(updatedData.id, updatedData);
  };
  const updateJsonDataMutation = useMutation(updatedDataRecieveFun, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });
  // const updateJsonDataMutation = useMutation((updatedData) => {
  //   updateJsonData(updatedData.id, updatedData);

  //   console.log("updatedData>>", updatedData);
  // });

  const deleteJsonData = useMutation((id) => {
    return axios.delete(`http://localhost:4000/data/${id}`);
  });

  if (isLoading) {
    return (
      <div>
        <img src={loading} alt="loading..." className="loading_gif" />
      </div>
    );
  }
  if (error) {
    return <div>"Error..."</div>;
  }

  const showDailogBox = (rowObj) => {
    setRowDataObj({
      userId: rowObj.userId,
      id: rowObj.id,
      title: rowObj.title,
      body: rowObj.body,
    });

    setVisible(true);
  };
  const editButtonTemplete = (rowData) => {
    return (
      <>
        <Button
          type="button"
          icon="pi pi-user-edit"
          onClick={() => showDailogBox(rowData)}
        />
      </>
    );
  };
  const addButtonTemplete = () => {
    setRowDataObj(null);

    if (rowDataObj === null) {
      setVisible(true);
    }
  };
  const addDataBtn = () => {
    console.log("add functional called>>");
    const newData = rowDataObj;
    setRowDataObj({
      // userId: new Date().getTime(),
      userId:"2",

      // id: new Date().getTime(),
      title: newData.title,
      body: newData.body,
    });
    addJsonDataMution.mutate(rowDataObj);
    setVisible(false);
    console.log("rowDataObj>>", rowDataObj);
  };
  const deleteButtonTemplete = (rowData) => {
    return (
      <>
        <Button
          type="button"
          icon="pi pi-trash"
          onClick={() => deleteJsonData.mutate(rowData.id)}
        />
      </>
    );
  };
  const handleSubmit = () => {
    // e.preventDefault();

    updateJsonDataMutation.mutate(rowDataObj);
    setVisible(false);
  };

  return (
    <>
      <div className="container">
        <div className="card cardTable">
          <Button
            type="button"
            icon="pi pi-user-plus"
            className="editBtn"
            onClick={addButtonTemplete}
          />
          <DataTable value={data} tableStyle={{ minWidth: "50rem" }}>
            <Column field="id" header="Id"></Column>
            <Column field="title" header="Title"></Column>
            <Column field="body" header="Description"></Column>
            <Column header="Edit" body={(row) => editButtonTemplete(row)} />
            <Column header="Delete" body={(row) => deleteButtonTemplete(row)} />
          </DataTable>
        </div>
      </div>

      <Dialog
        header="Header"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <form>
          <label>Title</label>
          <span className="p-float-label">
            <InputText
              id="title"
              value={rowDataObj?.title}
              onChange={(e) =>
                setRowDataObj({ ...rowDataObj, title: e.target.value })
              }
            />
            <label htmlFor="title">Title</label>
          </span>
          <label>Description</label>
          <span className="p-float-label">
            <InputText
              id="desc"
              value={rowDataObj?.body}
              onChange={(e) =>
                setRowDataObj({ ...rowDataObj, body: e.target.value })
              }
            />
            <label htmlFor="desc">Description</label>
          </span>
          {data.userId ? (
            <Button
              label="Save"
              type="button"
              icon="pi pi-check"
              onClick={handleSubmit}
              autoFocus
            />
          ) : (
            <Button
              label="Add"
              type="button"
              icon="pi pi-check"
              onClick={addDataBtn}
              autoFocus
            />
          )}
        </form>
      </Dialog>
    </>
  );
};

export default React_Query_Ex;
