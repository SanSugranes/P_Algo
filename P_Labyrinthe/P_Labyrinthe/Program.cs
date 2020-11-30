using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P_Labyrinthe
{
    class Program
    {
        static Random rand;

        const int GRIDSIZE = 30;

        static int[,] tabGrid = new int[GRIDSIZE, GRIDSIZE];

        static int[] firstPos = new int[2];

        static void Main(string[] args)
        {
            rand = new Random();

            MakeMaze();

            Console.Read();
        }

        static void MakeMaze()
        {
            int[] firstCell = GetRndBorderCell();

            tabGrid[firstCell[0], firstCell[1]] = 1;

            CheckCell(firstPos[0], firstPos[1], firstCell[0], firstCell[1]);


            for (int y = 0; y < GRIDSIZE; y++)
            {
                for (int x = 0; x < GRIDSIZE; x++)
                {
                    if (tabGrid[x, y] == 1)
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                    }
                    else
                    {
                        Console.ResetColor();
                    }
                    Console.Write("██");
                }
                Console.WriteLine();
            }
        }

        static bool CheckCell(int x, int y, int lastX, int lastY)
        {
            //check des bords
            if (x == 0 || y == 0 || x == GRIDSIZE - 1 || y == GRIDSIZE - 1)
            {
                return false;
            }
            //check des cotés
            if ((lastX != x + 1 && tabGrid[x + 1, y] == 1) || (lastX != x - 1 && tabGrid[x - 1, y] == 1) ||
                (lastY != y + 1 && tabGrid[x, y + 1] == 1) || (lastY != y - 1 && tabGrid[x, y - 1] == 1))
            {
                return false;
            }
            else
            {
                //enregistrement de la case
                tabGrid[x, y] = 1;

                List<int> positionsY = new List<int> { -1, 1 };         //stock des positions X
                List<int> positionsX = new List<int> { -1, 1 };         // et des Y

                do
                {
                    switch (rand.Next(2))
                    {
                        case 0:
                            if (positionsX.Count >= 1)
                            {
                                int randX = rand.Next(positionsX.Count -1 );
                                CheckCell(x + positionsX[randX], y, x, y);
                                positionsX.Remove(positionsX[randX]);
                            }
                            break;
                        case 1:
                            if (positionsY.Count >= 1)
                            {
                                int randY = rand.Next(positionsY.Count -1 );
                                CheckCell(x, y + positionsY[randY], x, y);
                                positionsY.Remove(positionsY[randY]);
                            } 
                            break;
                    }
                } while (positionsX.Count > 0 || positionsY.Count > 0);


                    return false;
            }
        }

        static int[] GetRndBorderCell()
        {
            int[] buffer;
            switch (rand.Next(4))
            {
                //top
                case 0:
                    buffer = new int[] { rand.Next(1, GRIDSIZE), 0 };
                    firstPos[0] = buffer[0];
                    firstPos[1] = buffer[1];
                    firstPos[1] += 1;
                    return buffer;
                    break;
                //bottom
                case 1:
                    buffer = new int[] { rand.Next(1, GRIDSIZE), GRIDSIZE - 1 };
                    firstPos[0] = buffer[0];
                    firstPos[1] = buffer[1];
                    firstPos[1] -= 1;
                    return buffer;
                    break;
                //left
                case 2:
                    buffer = new int[] { 0, rand.Next(1, GRIDSIZE) };
                    firstPos[0] = buffer[0];
                    firstPos[1] = buffer[1];
                    firstPos[0] += 1;
                    return buffer;
                    break;
                //right
                case 3:
                    buffer = new int[] { GRIDSIZE - 1, rand.Next(1, GRIDSIZE) };
                    firstPos[0] = buffer[0];
                    firstPos[1] = buffer[1];
                    firstPos[0] -= 1;
                    return buffer;
                    break;
            }
            return null;
        }
    }
}
