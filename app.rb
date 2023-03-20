class App < Formula
    desc "A CLI tool to generate git commit messages using OpenAI's GPT-4."
    homepage "https://github.com/tommyle/commit_ai_nodejs/tree/main"
    url "https://github.com/tommyle/commit_ai_nodejs/archive/refs/tags/v0.0.4.tar.gz"
    sha256 "f60cb101ebb6e3440abc38b8031639e6ee3d142a5fe8f026b2b633e9c41bf64c"
    license "MIT"
  
    depends_on "node"
  
    def install
      libexec.install Dir["*"]
      bin.install_symlink "#{libexec}/app.js" => "commitai"
    end
  
    test do
      system "#{bin}/commitai", "--version"
    end
  end
  