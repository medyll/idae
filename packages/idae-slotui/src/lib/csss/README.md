# About css stuff

- ## It's about css

  It's about css and the way some revolutions did save the world.  
   It's not about suffering, it's about emancipation, because being static is always a first start.  
   And it's about css. And a bit about Tailwind. Because tailwind did save us.

  #### lovy Granny

  To learn me the little cssSheet redbook, my grandMa did the basis. She was born in 1480 and did work since her 14s at the W3C, her job was to set normes a normal way. She was a bit of a monster, but she was right.

  #### complexity

  And she was right with the method: keeping me with a clou transperçant my feet while repeating the declinations of cssRules was the way to make me strong. The feeling of css needs the knowledge of pain.

  #### complexity and strength

  Because if it's complex, you're strong!

- ## It's not about Tailwind

  But i kept having some secrets toughs : but what if the word was organized an organized way ?

  **questions** : i know that a property which randomly target the outer or the inner of the concerned element is savagely cool, but what if not ? what if top was a position ? what if i want to setup the left and the right of the same border declaration ? what if verbosity was not the goal ? may i dream or did i dream ?  
  **answers** : Because there were no problems, i decided to seek for a solution. And i did reach severals.

  ### utility classes are right

  Around 2005, i did my first utility css monster. Based on php, acronym of "best language ever", it made me the king of velocity. Year and babies after, a non impressioné colleague asked me a simple question :

  ### Tailwind is right

  He asked: do you know things about **Tailwind** ? Do you know it has a wild css coverage and a lot of pretty babies ?

  - #### Humanity is a pretty monster

    He revealed me also the existence of a "reseau social", called Twitter, so i headed to it and it was a 5 elements Lilo thing, the lagrimas revelation time. The humanity is seeking for a solution while css detonations do craters with border-radius-top-left properties. And people are fighting in their textual multi-verse, yelling to each others that tailwind is a master so why do you yell ?

  - #### Tailwind is unsinkable

    Humanity is a pretty and a monster, and css are born in this humanity nest. css is eradicating humanity and Tailwind is the anchor which prevents the word to sink. Working without utility classes is a time consuming task, obvious leading to the nearest of a delirium tremens : reporting this is not an information, this is a therapy.

  - #### Css is a time traveling iceberg

    But the fact is, Tailwind is the unsinkable boat, and css is the iceberg. Utility classes are a must, so why the anger ? Aren't we safe from the iceberg ? Each time we approach it, we defeat the risk with a re-implementation time loop, UnoCss being my favorite one.

- ## It's a about the void

  > There is no solution.

  There are no solutions.  
   The socle is the problem, here is the void:

  ```css
  ::void {
  	position: absolute; /* a flow */
  	width: 0; /* a size */
  	top: -50px; /* a position */
  	margin: -50px 20px; /* a position! **/
  	gap: 20px; /* a margin */
  	padding: 20px; /* a gap */
  	display: inline; /* a flow */
  	display: none; /* a state */
  	display: flex; /* Inhaltsausrichtung ? */
  	color: #000; /* a color */
  	background-color: #fff; /* a color */
  }
  ```

- ## It's about this time loop

  Organization with Tailwind or other utility classes is mandatory for readability and maintainability. Because if you claim never going back to the code, then you'll have to admit the existence of fear.  
   What is the point ?  
  We love Tailwind, **Unocss** or others because they are shorteners. You think, you write, bam !  
  Let's get it with some words :

  #### from tailwind utility verb

  Bringing back the shortness to the '\<style>' tag is a meeting point : shortness and seeming near standards. Here, categorization means readability and **predictability**.

  This could be the only way, this is mine since epoch:

  ```scss
  input {
  	--at-apply: padding gap;
  	--at-apply: width height;
  	--at-apply: left top right bottom margin;
  	--at-apply: border shadow radius;
  	--at-apply: color bg;
  	// avoid using the bloated part of those magic libs
  	&:hover {
  		--at-apply: color bg;
  	}
  }
  ```

  #### to semantic css words

  right, bottom, top and left are a position. and collide with position being a property.  
   width and height are a size, a dimension, they should stick together.  
   margin and padding seem friends, but concern the outer vs the inner of the element.  
  utility needs semantics :

  ```css
  input {
  	margin: padding gap;
  	size: width height;
  	position: left top right bottom margin;
  	box: border shadow radius;
  	theme: color bg;
  }
  ```

- ## It's about hoping

  > hoping is having hope, but actively.

  To implement this i need :

  - a rule set: to decide the verbs
  - a model: to ensure strict rules
  - a parser : to walk trough the model
  - a transformer : to render back the rules.

  the needed mental strength :

  - a guide: bringing active solidity
  - a hole: there are some glitches to ditch in it, some properties to abandon, sadness to have
  - a goal: the browser is not the goal, could it be ?

  Let's start with something else : the guide to ensure consistency

  ```typescript
  /**  cssGuideTransform :
   * transform the model to a ts declaration file and an associated class methods.
   */
  function cssGuideTransform(modelSheet: Record<string, any>) {}
  ```
