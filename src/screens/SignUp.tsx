import { gql, useMutation } from "@apollo/client";
import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import {FatLink} from "../components/shared";
import routes from "../routes";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubTitle = styled(FatLink)`
    font-size: 16px;
    text-align: center;
    margin-top : 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

  type SignUpInput = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  };
  
  function SignUp() {

    const history = useHistory();
    const onCompleted = (data : any) => {
      const { username, password } = getValues();

      const {
        createAccount: { ok },
      } = data;

      if (!ok) {
        return;
      }

      history.push(routes.home, {
        message: "Account created. Please log in.",
        username,
        password,
      });
    };
    
    const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
      onCompleted,
    });

    const { register, handleSubmit, getValues, formState: {isValid} } = useForm<SignUpInput>({
      mode: "onChange",
    });

    const onSubmitValid = (data : any) => {
      if (loading) {
        return;
      }
      createAccount({
        variables: {
          ...data,
        },
      });
    };


    return (
      <AuthLayout>
        <PageTitle title="Sign up" />
        <FormBox>
          <HeaderContainer>
            <FontAwesomeIcon icon={faBitcoin} size="3x" />
            <SubTitle>
              Sign up to see Photos from your friends.
            </SubTitle>
          </HeaderContainer>
          <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName",{
              required: "First Name is required.",
            })}
            name="firstName"
            type="text"
            placeholder="First Name"
          />
          <Input
            {...register("lastName")}
            type="text"
            placeholder="Last Name"
            name="lastName"
          />
          <Input
            {...register("email",{
              required: "Email is required.",
            })}
            name="email"
            type="text"
            placeholder="Email"
          />
          <Input
            {...register("username",{
              required: "Username is required.",
            })}
            name="username"
            type="text"
            placeholder="Username"
          />
          <Input
            {...register("password",{
              required: "Password is required.",
            })}
            name="password"
            type="password"
            placeholder="Password"
          />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!isValid || loading}
          />
          </form>

        </FormBox>
        <BottomBox
          cta="Have an account?"
          linkText="Log in"
          link={routes.home}
        />
      </AuthLayout>
    );
  }
  export default SignUp;