import { Layout } from "../components/Layout";
import { AuthForm } from "../components/AuthForm";

export const SignupPage = () => (
  <Layout>
    <AuthForm mode="signup" />
  </Layout>
);
