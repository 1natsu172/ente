import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { MfaForm } from "./MfaForm.js";
import { useEmail } from "../../hooks/accountHooks/index.js";

export const EmailForm = () => {
  const { push } = useNavigation();
  const { handleSubmit } = useForm({
    onSubmit(values) {
      push(<MfaForm />);
    },
  });
  const { email } = useEmail();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="email" title="Email" placeholder="your@domain.com" defaultValue={email} storeValue={true} />
    </Form>
  );
};
