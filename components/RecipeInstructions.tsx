type Instruction = {
  step: number;
  text: string;
};

type Props = {
  recipe: { instructions: Instruction[] };
};

export default function RecipeInstructions({ recipe }: Props) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Instructions</h2>
      <ol className="list-decimal pl-5 space-y-2">
        {recipe.instructions.map((inst) => (
          <li key={inst.step}>{inst.text}</li>
        ))}
      </ol>
    </section>
  );
}
