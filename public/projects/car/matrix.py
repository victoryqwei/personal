import random
import pickle

class Matrix:
  def __init__(self, rows, cols):
    self.rows = rows
    self.cols = cols
    self.data = []

    for x in range(0, rows):
      self.data.append([])
      for y in range(0, cols):
        self.data[x].append(2)

  def copy(self):
    m = Matrix(self.rows, self.cols)
    for i in range(0, self.rows):
      for j in range(0, self.cols):
        m.data[i][j] = self.data[i][j]
    return m;

  @staticmethod
  def multiply(a, b):
    if a.cols != b.rows:
      print("Cols of A don't match Cols of B")
      return
    
    result = Matrix(a.rows, b.cols)
    result.map(mult, a, b)

    return result

  def multiply(self, n):
    if type(n) == Matrix:
      for i in range(0, self.rows):
        for j in range(0, self.cols):
          self.data[i][j] *= n.data[i][j]
    else:
      for i in range(0, self.rows):
        for j in range(0, self.cols):
          self.data[i][j] *= n

  def add(self, n):
    if type(n) == Matrix:
      for i in range(0, self.rows):
        for j in range(0, self.cols):
          self.data[i][j] += n.data[i][j]
    else:
      for i in range(0, self.rows):
        for j in range(0, self.cols):
          self.data[i][j] += n

  @staticmethod
  def subtract(a, b):
    if a.cols != b.rows:
      print("Cols of A don't match Cols of B")
      return

  def subtract(self, n):
    if type(n) == Matrix:
      for i in range(0, self.rows):
        for j in range(0, self.cols):
          self.data[i][j] -= n.data[i][j]
    else:
      for i in range(0, self.rows):
        for j in range(0, self.cols):
          self.data[i][j] -= n
    
    result = Matrix(a.rows, b.cols)
    result.map(sub, a, b)

    return result

  @staticmethod
  def fromArray(arr):
    m = Matrix(len(arr), 1)
    for i in range(0, len(arr)):
      m.data[i][j] = arr[i]
    return m

  def toArray(self):
    arr = []

    for i in range(0, self.rows):
      for j in range(0, self.cols):
        arr.append(self.data[i][j])

    return arr

  def randomize(self):
    for i in range(0, self.rows):
      for j in range(0, self.cols):
        self.data[i][j] = random.randint(-1, 1)

  @staticmethod
  def transpose(matrix):
    m = Matrix(matrix.cols, matrix.rows)

    for i in range(0, matrix.rows):
      for j in range(0, matrix.cols):
        m.data[j][i] = matrix.data[i][j]

  def map(self, func, a, b):
    for i in range(0, self.rows):
      for j in range(0, self.cols):
        self.data[i][j] = func(self.data[i][j], i, j, a, b)

  @staticmethod
  def map(matrix, func):
    result = Matrix(matrix.rows, matrix.cols)

    for i in range(0, matrix.rows):
      for j in range(0, matrix.cols):
        val = matrix.data[i][j]
        result.data[i][j] = func(val)

    return result

  def print(self):
    matrixPrints = 0
    while matrixPrints != len(self.data):
      print(self.data[matrixPrints])
      matrixPrints += 1

  def serialize(self):
    return pickle.dumps(self.data)

  @staticmethod
  def deserialize(self, data):
    arr = pickle.loads(data)
    return arr
    # Still needs to be turned back into a Matrix

m1 = Matrix(5, 5)
m2 = Matrix(5, 5)
print(m1.data)

def mult(e, i, j, a, b):
  sum = 0
  for k in range(0, a.cols):
    sum += a.data[i][k] * b.data[k][j]
  return sum

def sub(e, i, j, a, b):
  sum = a.data[i][j] - b.data[i][j]
  return sum