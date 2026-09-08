import { IamClient } from '@docusign/iam-sdk';
import { TriggerWorkflowSuccess$inboundSchema } from '@docusign/iam-sdk/models/components';

export const getWorkflowDefinitions = async (args) => {
  const client = new IamClient({accessToken: args.accessToken});
  return client.maestro.workflows.getWorkflowsList({accountId: args.accountId});
};

export const getWorkflowTriggerRequirements = async (args) => {
  const client = new IamClient({accessToken: args.accessToken});
  return client.maestro.workflows.getWorkflowTriggerRequirements({accountId: args.accountId, workflowId: args.workflowId});
};

export const triggerWorkflowInstance = async (args, payload) => {
  const client = new IamClient({ accessToken: args.accessToken });
  const triggerPayload = {
    instanceName: `workflow-${Date.now()}`,
    triggerInputs: payload.triggerInputs || {},
  };

  try {
    return await client.maestro.workflows.triggerWorkflow({
      accountId: args.accountId,
      workflowId: args.workflowId,
      triggerWorkflow: triggerPayload,
    });
  } catch (error) {
    // SDK's generated matcher only accepts status 200, but Maestro returns 201 on a successful trigger
    if (error?.name === 'APIError' && error.statusCode === 201 && error.contentType?.includes('application/json')) {
      return TriggerWorkflowSuccess$inboundSchema.parse(JSON.parse(error.body));
    }
    throw error;
  }
};