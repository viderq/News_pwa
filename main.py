class Soldier:
    health = 100

    def attack(self, unit):
        unit.health = unit.health - 20


unit_1 = Soldier()
unit_2 = Soldier()

for i in range(5 ):
    unit_1.attack(unit_2)
    print(unit_2.health)