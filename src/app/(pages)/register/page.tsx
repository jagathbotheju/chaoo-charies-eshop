import Container from "@/components/Container";
import FormWrap from "@/components/FormWrap";
import RegisterForm from "@/app/(pages)/register/RegisterForm";

const RegisterPage = () => {
  return (
    <Container>
      <FormWrap>
        <RegisterForm />
      </FormWrap>
    </Container>
  );
};

export default RegisterPage;
