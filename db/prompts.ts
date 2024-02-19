import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"
import { toast } from "sonner"

const toastOptions = {
  className:
    "bg-red-500 text-white font-medium text-lg p-5 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  duration: 5000
}

export const getPromptByName = async (name: string) => {
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("name", name)
    .single()

  if (error) {
    if (error.details === "The result contains 0 rows") {
      toast(`Prompt with name '${name}' not found.`, toastOptions)
    } else if (error.details.includes("The result contains")) {
      const regex = /(\d*[1-9]\d*) rows/
      const match = error.details.match(regex)

      if (match) {
        const rowCount = match[1]
        toast(
          `Unexpected Error: Multiple macros (${rowCount}) found with name '${name}'. This indicates a data consistency issue.`,
          toastOptions
        )

        console.error("Data Inconsistency Error:", error)
      } else {
        toast(
          `Unexpected Error: '${error.details}' found with loading macro '${name}'.`,
          toastOptions
        )
      }
    } else {
      toast(
        "An error occurred while fetching the prompt. Please try again later or contact support.",
        toastOptions
      )
      console.error("Supabase Error:", error)
    }

    throw error // Re-throw for further handling if needed
  }

  return prompt
}

export const getPromptById = async (promptId: string) => {
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", promptId)
    .single()

  if (!prompt) {
    throw new Error(error.message)
  }

  return prompt
}

export const getPromptWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select(
      `
      id,
      name,
      prompts (*)
    `
    )
    .eq("id", workspaceId)
    .single()

  if (!workspace) {
    throw new Error(error.message)
  }

  return workspace
}

export const getPromptWorkspacesByPromptId = async (promptId: string) => {
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", promptId)
    .single()

  if (!prompt) {
    throw new Error(error.message)
  }

  return prompt
}

export const createPrompt = async (
  prompt: TablesInsert<"prompts">,
  workspace_id: string
) => {
  const { data: createdPrompt, error } = await supabase
    .from("prompts")
    .insert([prompt])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  await createPromptWorkspace({
    user_id: createdPrompt.user_id,
    prompt_id: createdPrompt.id,
    workspace_id
  })

  return createdPrompt
}

export const createPrompts = async (
  prompts: TablesInsert<"prompts">[],
  workspace_id: string
) => {
  const { data: createdPrompts, error } = await supabase
    .from("prompts")
    .insert(prompts)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  await createPromptWorkspaces(
    createdPrompts.map(prompt => ({
      user_id: prompt.user_id,
      prompt_id: prompt.id,
      workspace_id
    }))
  )

  return createdPrompts
}

export const createPromptWorkspace = async (item: {
  user_id: string
  prompt_id: string
  workspace_id: string
}) => {
  const { data: createdPromptWorkspace, error } = await supabase
    .from("prompt_workspaces")
    .insert([item])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdPromptWorkspace
}

export const createPromptWorkspaces = async (
  items: { user_id: string; prompt_id: string; workspace_id: string }[]
) => {
  const { data: createdPromptWorkspaces, error } = await supabase
    .from("prompt_workspaces")
    .insert(items)
    .select("*")

  if (error) throw new Error(error.message)

  return createdPromptWorkspaces
}

export const updatePrompt = async (
  promptId: string,
  prompt: TablesUpdate<"prompts">
) => {
  const { data: updatedPrompt, error } = await supabase
    .from("prompts")
    .update(prompt)
    .eq("id", promptId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedPrompt
}

export const deletePrompt = async (promptId: string) => {
  const { error } = await supabase.from("prompts").delete().eq("id", promptId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const deletePromptWorkspace = async (
  promptId: string,
  workspaceId: string
) => {
  const { error } = await supabase
    .from("prompt_workspaces")
    .delete()
    .eq("prompt_id", promptId)
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)

  return true
}
