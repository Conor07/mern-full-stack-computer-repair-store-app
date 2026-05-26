import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import NotesList from "./features/notes/NotesList";
import NewUserForm from "./features/users/NewUserForm";
import EditUser from "./features/users/EditUser";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Public />} />
            <Route path="login" element={<Login />} />
          </Route>

          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />

              <Route path="users">
                <Route index element={<UsersList />} />

                <Route path=":id" element={<EditUser />} />

                <Route path="new" element={<NewUserForm />} />
              </Route>

              <Route path="notes">
                <Route index element={<NotesList />} />

                <Route path=":id" element={<EditUser />} />

                <Route path="new" element={<NewNote />} />
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
