import OpenAI from "openai";
const openai = new OpenAI();

export async function callGPT({
  instruction,
  context_tags,
  failure_node,
  failure_type,
  mode,
  desired_fix_type,
  language_register,
  target_role
}) {
  const prompt = `Instruction: ${instruction}\nContext: ${context_tags.join(", ")}\nFailure Node: ${failure_node}\nFailure Type: ${failure_type}\nMode: ${mode}\nDesired Fix: ${desired_fix_type}\nLanguage Register: ${language_register}\nTarget Role: ${target_role}`;
  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  return res.choices[0]?.message?.content?.trim();
}
