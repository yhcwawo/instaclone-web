import { faBitcoin, faGooglePlusSquare} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import Separator from "../components/auth/Separator";
import PageTitle from "../components/PageTitle";
import routes from "../routes";
import { logUserIn } from "../apollo";

  const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        ok
        token
        error
      }
    }
  `;

  const KakaoLogin = styled.div`
    color: #385285;
    span {
      margin-left: 10px;
      font-weight: 600;
    }
  `;

  const Notification = styled.div`
    color: #2ecc71;
  `;

  type LoginInput = {
    username: string;
    password: string;
    result: string;
  };

  function Login() {

    const location = useLocation();

    const {register, handleSubmit, getValues, setError, clearErrors, formState: {errors, isValid} } = useForm<LoginInput>({
      mode: "onChange",
      defaultValues: {
        username: location?.state?.username || "",
        password: location?.state?.password || "",
      },
    });

    const onCompleted = (data : any) => {
      const {
        login: { ok, error, token },
      } = data;

      if (!ok) {
        return setError("result", {
          message: error,
        });
      }

      if (token) {
        logUserIn(token);
      }
    };

    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
      onCompleted,
    });

    const onSubmitValid = (data : any) => {

      if (loading) {
        return;
      }
      const { username, password } = getValues();

      login({
        variables: { username, password },
      });

    };

    const clearLoginError = () => {
      clearErrors("result");
    };


    return (
      <AuthLayout>
        <PageTitle title="Log in" />
        <FormBox>
          <div>
            <FontAwesomeIcon icon={faBitcoin} size="3x" />
          </div>

          <Notification>{location?.state?.message}</Notification>

          <form onSubmit={handleSubmit(onSubmitValid)}>
            
            <Input 
              {...register("username", {
                required: "Username is required.",
                minLength: {
                  value: 4,
                  message: "Username should be longer than 4 chars."
                },
                //validate: (currentValue) => currentValue.includes("potato"),
              })}
              //onChange={clearLoginError}
              name="username" 
              type="text" 
              placeholder="Username" 
              itemScope={Boolean(errors?.username?.message)}
            />
            <FormError message={errors?.username?.message} />
          
            <Input 
              {...register("password",{
                required: "Password is required.",
                minLength: {
                  value: 5,
                  message: "Password should be longer than 5 chars."
                },
              })}
              //onChange={clearLoginError}
              name="password" 
              type="password" 
              placeholder="Password" 
              itemScope={Boolean(errors?.password?.message)}
            />
            <FormError message={errors?.password?.message} />

            <Button
              type="submit"
              value={loading ? "Loading..." : "Log in"}
              disabled={!isValid || loading}
            />
            <FormError message={errors?.result?.message} />

          </form>
          <Separator />
          <KakaoLogin>
            <FontAwesomeIcon icon={faGooglePlusSquare} />
            <span>Log in with KaKao</span>
          </KakaoLogin>
        </FormBox>
        <BottomBox
          cta="Don't have an account?"
          linkText="Sign up"
          link={routes.signUp}
        />
      </AuthLayout>
    );
  }
  export default Login;