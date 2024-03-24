import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { MfaForm } from "./MfaForm.js";
import { PasswordForm } from "./PasswordForm.js";
import { loginUser } from "../../services/loginService.js";
import { PAGES } from "@ente/accounts/constants/pages.js";

type FormValues = {
  email: string;
};

export const EmailForm = () => {
  const { push } = useNavigation();
  const { handleSubmit } = useForm<FormValues>({
    async onSubmit(values) {
      const { nextAction } = await loginUser(values.email);
      if (nextAction === PAGES.VERIFY) {
        push(<MfaForm />);
      } else {
        push(<PasswordForm />);
      }
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="email" title="Email" placeholder="your@domain.com" storeValue={true} />
    </Form>
  );
};
