import Container from "@/components/Container";
import { ReloadIcon } from "@radix-ui/react-icons";

const Loading = () => {
  return (
    <Container>
      <div className="w-full h-full flex justify-center items-center">
        <ReloadIcon className="mr-2 h-10 w-10 animate-spin" />
      </div>
    </Container>
  );
};

export default Loading;
