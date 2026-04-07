import { Layout } from "../components/Layout";
import { AuthForm } from "../components/AuthForm";

export const LoginPage = () => (
  <Layout>
    <AuthForm mode="login" />
  </Layout>
);
