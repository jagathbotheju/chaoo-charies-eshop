import Container from "@/components/Container";
import AdminAddProductForm from "./AdminAddProductForm";
import FormWrap from "@/components/FormWrap";

const AdminAddProductsPage = () => {
  return (
    <div>
      <Container>
        <FormWrap width="lg">
          <AdminAddProductForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AdminAddProductsPage;
