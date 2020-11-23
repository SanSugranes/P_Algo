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

        static byte[,] tabGrid = new byte[GRIDSIZE, GRIDSIZE];

        static int[] lastPos;

        static void Main(string[] args)
        {
            rand = new Random();

            tabGrid[1, 7] = 1;

            MakeMaze();

            Console.Read();
        }

        static void MakeMaze()
        {
            int firstCell = rand.Next(GRIDSIZE);

            tabGrid[firstCell, 0] = 1;

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
                    Console.Write("█");
                }
                Console.WriteLine();
            }
        }

        static bool CheckCell(byte x, byte y)
        {
            if (tabGrid[x + 1, y] == 1 || tabGrid[x - 1, y] == 1 || tabGrid[x, y + 1] == 1 || tabGrid[x, y - 1] == 1 || x == 0 || y == 0 || x == GRIDSIZE || y == GRIDSIZE)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
}
